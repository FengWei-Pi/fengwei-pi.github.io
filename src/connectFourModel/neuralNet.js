import buf from "buffer/";
import * as tf from "@tensorflow/tfjs";

const Buffer = buf.Buffer;

export function getNewModel() {
  return tf.tidy(() => {
    const regularizer = tf.regularizers.l2({ l2: 0.0001 });

    const input = tf.input({ shape: [7, 6, 3] });
    const padding = tf.layers.zeroPadding2d({ padding: 1 }).apply(input);

    // Convolutional layer
    const convolution1 = tf.layers.conv2d({
      kernelSize: 4,
      filters: 256,
      strides: 1,
      kernelRegularizer: regularizer,
      biasRegularizer: regularizer
    }).apply(padding);
    const batchNorm1 = tf.layers.batchNormalization({ momentum: 0.1 }).apply(convolution1);
    const relu1 = tf.layers.reLU().apply(batchNorm1);

    // Residual block
    const convolution2 = tf.layers.conv2d({
      kernelSize: 3,
      filters: 256,
      strides: 1,
      kernelRegularizer: regularizer,
      biasRegularizer: regularizer,
      padding: "same"
    }).apply(relu1);
    const batchNorm2 = tf.layers.batchNormalization({ momentum: 0.1 }).apply(convolution2);
    const relu2 = tf.layers.reLU().apply(batchNorm2);

    const convolution3 = tf.layers.conv2d({
      kernelSize: 3,
      filters: 256,
      strides: 1,
      kernelRegularizer: regularizer,
      biasRegularizer: regularizer,
      padding: "same"
    }).apply(relu2);
    const batchNorm3 = tf.layers.batchNormalization({ momentum: 0.1 }).apply(convolution3);

    const add1 = tf.layers.add().apply([relu1, batchNorm3]);
    const relu3 = tf.layers.reLU().apply(add1);

    // Policy head
    const convolution4 = tf.layers.conv2d({
      kernelSize: 1,
      filters: 16,	
      strides: 1,
      kernelRegularizer: regularizer,
      biasRegularizer: regularizer
    }).apply(relu3);
    const batchNorm4 = tf.layers.batchNormalization({ momentum: 0.1 }).apply(convolution4);
    const relu4 = tf.layers.reLU().apply(batchNorm4);

    const flatten1 = tf.layers.flatten().apply(relu4);

    const probabilities = tf.layers.dense({
      units: 7,
      activation: "softmax",
      kernelRegularizer: regularizer,
      biasRegularizer: regularizer
    }).apply(flatten1);

    // Value head
    const convolution5 = tf.layers.conv2d({
      kernelSize: 1,
      filters: 16,
      strides: 1,
      kernelRegularizer: regularizer,
      biasRegularizer: regularizer
    }).apply(relu3);
    const batchNorm5 = tf.layers.batchNormalization({ momentum: 0.1 }).apply(convolution5);
    const relu5 = tf.layers.reLU().apply(batchNorm5);

    const flatten2 = tf.layers.flatten().apply(relu5);

    const dense2 = tf.layers.dense({
      units: 256,
      activation: "relu",
      kernelRegularizer: regularizer,
      biasRegularizer: regularizer
    }).apply(flatten2);

    const value = tf.layers.dense({
      units: 1,
      activation: "tanh",
      kernelRegularizer: regularizer,
      biasRegularizer: regularizer
    }).apply(dense2);

    const model = tf.model({ inputs: input, outputs: [probabilities, value] });
    return model;
  }); // tf.tidy
}

const history = [];

export function compileAdam(model, learningRate=0.001, beta1 = 0.9, beta2 = 0.999) {
  model.compile({
    optimizer: tf.train.adam(learningRate, beta1, beta2),
    loss: [tf.losses.softmaxCrossEntropy, tf.losses.meanSquaredError],
  });
}

export function compileSGDMomentum(model, learningRate=0.1, momentum=0.9) {
  model.compile({
    optimizer: tf.train.momentum(learningRate, momentum),
    loss: [tf.losses.softmaxCrossEntropy, tf.losses.meanSquaredError],
  });
}

export async function trainModel(model, inputs, outputs, params = {}) {
  const { batchSize = 32, epochs = 20, ...rest } = params;

  return model.fit(inputs, outputs, {
    batchSize,
    epochs,
    shuffle: true,
    callbacks: {
      onEpochEnd: (epoch, log) => {
        history.push(log);
        console.log({ name: "Training Performance" }, history, ["loss"]);
      }
    },
    ...rest
  });
}

// Get model from storage
export async function getModel() {
  try {
    const model = await tf.loadLayersModel("localstorage://my-model");
    return model;
  } catch (error) {
    console.log("getting new model");
    tf.disposeVariables();
    const model = getNewModel();
    // await model.save('localstorage://my-model');
    return model;
  }
}

export async function getSerializedModel(model) {
  const result = await model.save(tf.io.withSaveHandler(async modelArtifacts => modelArtifacts));
  result.weightData = Buffer.from(result.weightData).toString("base64");
  return JSON.stringify(result);
}

export async function getDeserializedModel(jsonStr) {
  const json = JSON.parse(jsonStr);
  const weightData = new Uint8Array(Buffer.from(json.weightData, "base64")).buffer;
  return tf.loadLayersModel(
    tf.io.fromMemory({
      modelTopology: json.modelTopology,
      weightSpecs: json.weightSpecs,
      weightData: weightData
    })
  );
}

export function predict(connectFour, model) {
  return tf.tidy(() => {
    const inputs = getInputTensorsFromBitboards(connectFour.bitboards);
    const random = Math.random();
    const prediction = model.predict(random < 0.5 ? inputs : inputs.reverse(1));

    return random < 0.5 ?
      [prediction[0].arraySync()[0], prediction[1].arraySync()[0][0]]
      : [prediction[0].reverse(1).arraySync()[0], prediction[1].reverse(1).arraySync()[0][0]];
  });
}

export function getInputTensorsFromBitboards(bitboards) {
  return tf.tidy(() => {
    // Get board input
    const inputBuf = tf.buffer([1, 7, 6, 2]);

    for (let i=0; i<2; ++i) {
      for (let ind=0; ind < 48; ++ind) {
        if (bitboards[i].get(ind)) inputBuf.set(1, 0, Math.floor(ind / 7), ind % 7, i);
      }
    }

    return inputBuf.toTensor().pad(
      [[0, 0], [0, 0], [0, 0], [0, 1]],
      (bitboards[0].cardinality() + bitboards[1].cardinality()) & 1
    );
  });
}

/**
 * Returns the tensor of value outputs for the neural network. `result` is 0 if draw,
 * 1 if the first player won, -1 if the second player won.
 * 
 * @param {number} result 
 * @param {number} avgValues 
 */
export function getValuesTensorFromResult(result, numMoves) {
  return tf.tidy(() => {
    if (result === 0) return tf.fill([numMoves+1, 1], 0);

    // Normal reward
    return tf.tensor([result, -result], [2, 1])
      .tile([Math.ceil((numMoves+1)/2), 1])
      .slice(0, numMoves+1);
  });
}
