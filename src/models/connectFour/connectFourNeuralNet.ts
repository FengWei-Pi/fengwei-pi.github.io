import * as tf from "@tensorflow/tfjs";
import type BitSet from "bitset";

import { TurnGameNeuralNet } from "models/turnGame/neuralNet";
import type { ConnectFourBoard, ConnectFourMove } from "./connectFourBoard";

/**
 * Class that represents a neural network for evaluating connect four boards.
 * Object should be created with `TurnGameNeuralNet.build(ConnectFourNeuralNet, modelStr)`,
 * and not with `new ConnectFourNeuralNet(...)`.
 */
export class ConnectFourNeuralNet extends TurnGameNeuralNet<ConnectFourMove, ConnectFourBoard> {
  private getInputTensorsFromBitboards(bitboards: [BitSet, BitSet]) {
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

  predict(connectFour: ConnectFourBoard) {
    const outputs : [Array<number>, number] = tf.tidy(() => {
      // @ts-expect-error TODO change to work with connectFour.getPastMoves()
      // instead of private member bitboards
      const inputs = this.getInputTensorsFromBitboards(connectFour.bitboards);
      const random = Math.random();
      const outputTensors = this.getModel().predict(random < 0.5 ? inputs : inputs.reverse(1));
  
      return random < 0.5 ?
        [outputTensors[0].arraySync()[0], outputTensors[1].arraySync()[0][0]]
        : [outputTensors[0].reverse(1).arraySync()[0], outputTensors[1].reverse(1).arraySync()[0][0]];
    });

    return {
      priors: new Map(outputs[0].map((prior, index) => [index, prior])),
      value: outputs[1]
    };
  }
}
