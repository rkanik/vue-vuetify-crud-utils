import { _regex } from '../consts'

// validators
export const required = fieldName => v => !!v || `${fieldName || 'Field'} is required.`
export const name = v => _regex.name.test(v) || `Name can only have characters`
export const email = v => _regex.email.test(v) || `Email is not valid.`
export const password = v => _regex.password.test(v) || `Password can't have less than 8 characters and more than 20 characters`
export const phone = v => _regex.phone.test(v) || `Password can't have less than 8 characters and more than 20 characters`
export const onlyCharacters = v => _regex.character.test(v) || 'Can\'t have special characters or numbers'

export const createValidationsMixin = fields => {


  // rules of all forms in the project
  let rules = {
    name: [required('Name'), name],
    email: [required('Email'), email],
    password: [required('Password'), password],
    phone: [required('Phone'), phone],
    onlyCharacter: [onlyCharacters]
  }

  // filtering needed rules
  rules = Object.keys(rules)
    .filter(fieldName => fields.includes(fieldName))
    .reduce((acc, fieldName) => ({ ...acc, [fieldName]: rules[fieldName] }), {})

  // returing mixin with needed rules 
  return {
    name: 'ValidationsMixin',
    data() {
      return {
        rules
      }
    }
  }
}

export const LoginValidations =
  createValidationsMixin([
    'email', 'password'
  ])

export const EmployeeValidations =
  createValidationsMixin([
    'email', 'password', 'phone','name'
  ])

export const NameFormValidations =
  createValidationsMixin([])
