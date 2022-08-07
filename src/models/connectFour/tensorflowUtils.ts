import * as tf from "@tensorflow/tfjs";
import buf from "buffer/";

const Buffer = buf.Buffer;

/**
 * Returns a string representing the model.
 * @see https://stackoverflow.com/questions/55532746/tensorflow-nodejs-serialize-deserialize-a-model-without-writing-it-to-a-uri
 */
export async function getSerializedModel(model : tf.LayersModel) : Promise<string> {
  // @ts-expect-error Using TensorFlow save features to get model data. See tf.io.ModelArtifacts
  const result = await model.save(tf.io.withSaveHandler(async modelArtifacts => modelArtifacts));

  // @ts-expect-error Converting ArrayBuffer to string. Reason unknown since tf.io.ModelArtifacts
  // has property modelTopology which is also an ArrayBuffer
  result.weightData = Buffer.from(result.weightData).toString("base64");
  return JSON.stringify(result);
}

/** Returns the TensorFlow layers model from `jsonStr` */
export async function getDeserializedModel(jsonStr : string) : Promise<tf.LayersModel> {
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

/**
 * Returns the tensor of value outputs for the neural network. `result` is 0 if draw,
 * 1 if the first player won, -1 if the second player won.
 */
export function getValuesTensorFromResult(result : number, numMoves : number) : tf.Tensor {
  return tf.tidy(() => {
    if (result === 0) return tf.fill([numMoves+1, 1], 0);

    // Normal reward
    return tf.tensor([result, -result], [2, 1])
      .tile([Math.ceil((numMoves+1)/2), 1])
      .slice(0, numMoves+1);
  });
}


// TODO move somewhere else
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

// TODO move somewhere else
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