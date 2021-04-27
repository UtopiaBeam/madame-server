export enum SpecialAction {
  Investigate = 'Investigate',
  Expose = 'Expose',
  Spy = 'Spy',
}

export interface SpecialActionDetail {
  type: number;
  name: SpecialAction;
  cost: number;
}

export class SpecialActionData {
  public static specialActions: SpecialActionDetail[] = [
    { type: 0, name: SpecialAction.Investigate, cost: 75 },
    { type: 1, name: SpecialAction.Expose, cost: 125 },
    { type: 2, name: SpecialAction.Spy, cost: 50 },
  ];

  public static getSpecialAction(type: number): SpecialActionDetail {
    return this.getSpecialAction[type];
  }
}
