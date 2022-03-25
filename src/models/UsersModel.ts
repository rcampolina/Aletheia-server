import { Adress } from './AdressModel';
export interface Users {
  id: number,
  name: string,
  email: string,
  phone: string,
  whatsapp: string,
  cpf: string,
  birthDate: string,
  condition: string,
  observations: string
  adress?: Adress
}