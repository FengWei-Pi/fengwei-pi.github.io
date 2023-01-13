import type { ConnectFourMove } from "./connectFourBoard";

export enum Action {
  SetNumSimulations,
  GetMove,
  UpdatePastMoves
}

export enum ActionReturn {
  GetMove
}

export type SetNumSimulations = {
  action: Action.SetNumSimulations,
  payload: number
}

export type UpdatePastMoves = {
  action: Action.UpdatePastMoves,
  payload: Array<ConnectFourMove>
}

export type GetMove = {
  action: Action.GetMove,
  payload: Array<ConnectFourMove> // past moves
}

export type GetMoveReturn = {
  action: ActionReturn.GetMove,
  payload: ConnectFourMove
}

export type Message = SetNumSimulations | UpdatePastMoves | GetMove;
export type MessageReturn = GetMoveReturn;