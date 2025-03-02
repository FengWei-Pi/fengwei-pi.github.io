import type { Analysis } from "../turnGame/computerStrategy";
import type { ConnectFourMove } from "./connectFourBoard";

export enum Action {
  SetNumSimulations,
  GetMove,
  UpdatePastMoves,
}

export enum Response {
  Move,
  Analysis
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

export type GetMoveResponse = {
  action: Response.Move,
  payload: ConnectFourMove
}

export type GetAnalysisResponse = {
  action: Response.Analysis,
  payload: Analysis<ConnectFourMove>
}

export type Message = SetNumSimulations | UpdatePastMoves | GetMove;
export type MessageResponse = GetMoveResponse | GetAnalysisResponse;