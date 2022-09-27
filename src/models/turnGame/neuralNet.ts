import * as tf from "@tensorflow/tfjs";
import buf from "buffer/";
import type { TurnGameModel } from "./model";

const Buffer = buf.Buffer;

/**
 * Class that represents a neural network for evaluating turn game models.
 * Derived classes must implement a constructor that accepts a tfjs layers model.
 * Objects should be created with `TurnGameNeuralNet.build(DerivedClass, modelStr)`.
 */
export abstract class TurnGameNeuralNet<MoveType, TurnGameType extends TurnGameModel<MoveType>> {
  private model: tf.LayersModel;

  constructor(model: tf.LayersModel) {
    this.model = model;
  }

  abstract predict(game: TurnGameType): { priors: Map<MoveType, number>, value: number };

  /** Returns the TensorFlow layers model from the provided `modelStr` */
  private static getDeserializedModel(modelStr : string) {
    const json = JSON.parse(modelStr);
    return TurnGameNeuralNet.getDeserializedModelFromJson(json);
  }

  private static getDeserializedModelFromJson(modelJson) {
    const weightData = new Uint8Array(Buffer.from(modelJson.weightData, "base64")).buffer;
    
    return tf.loadLayersModel(
      tf.io.fromMemory({
        modelTopology: modelJson.modelTopology,
        weightSpecs: modelJson.weightSpecs,
        weightData: weightData
      })
    );
  }

  /**
   * Returns a string representing the model.
   * @see https://stackoverflow.com/questions/55532746/tensorflow-nodejs-serialize-deserialize-a-model-without-writing-it-to-a-uri
   */
  private static async getSerializedModel(model : tf.LayersModel) {
    // @ts-expect-error Using TensorFlow save features to get model data. See tf.io.ModelArtifacts
    const result = await model.save(tf.io.withSaveHandler(async modelArtifacts => modelArtifacts));

    // @ts-expect-error Converting ArrayBuffer to string
    result.weightData = Buffer.from(result.weightData).toString("base64");

    return JSON.stringify(result);
  }

  // Builder pattern to perform async operations when constructing object.
  // See https://stackoverflow.com/a/43433773
  static async build<MoveType, TurnGameType extends TurnGameModel<MoveType>>(
    constructor: new (model: tf.LayersModel) => TurnGameNeuralNet<MoveType, TurnGameType>,
    modelStr: string | Object
  ) {
    let model;

    if (typeof modelStr === "string") model = await TurnGameNeuralNet.getDeserializedModel(modelStr);
    else model = await TurnGameNeuralNet.getDeserializedModelFromJson(modelStr);

    return new constructor(model);
  }
  
  getModel() {
    return this.model;
  }
  
  async getModelStr() {
    return TurnGameNeuralNet.getSerializedModel(this.model);
  }
}