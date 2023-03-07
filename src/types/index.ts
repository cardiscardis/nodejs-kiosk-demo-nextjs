export interface IField {
  type: string,
  required: boolean,
  id: string,
  name: string,
  label: string,
  options: IOptionField[],
  currency?: string
}

export interface IOptionField {
  id: string,
  label: string,
  value: string
}