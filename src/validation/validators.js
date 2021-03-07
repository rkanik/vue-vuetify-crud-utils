import { _regex } from '../consts'

// validators
export const required = fieldName => v => !!v || `${fieldName || 'Field'} is required.`
export const name = v => _regex.name.test(v) || `Name can only have characters`
export const email = v => _regex.email.test(v) || `Email is not valid.`
export const password = v => _regex.password.test(v) || `Password can't have less than 8 characters and more than 20 characters`
export const phone = v => _regex.phone.test(v) || `Password can't have less than 8 characters and more than 20 characters`
export const onlyCharacters = v => _regex.character.test(v) || 'Can\'t have special characters or numbers'