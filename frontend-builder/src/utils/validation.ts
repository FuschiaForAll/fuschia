//eslint-disable-next-line no-control-regex
const EMAIL_REGEX =
  /^((([a-z]|\d|[!#$%&'*+\-/=?^_`{|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#$%&'*+\-\\/=?^_`{|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i
//eslint-disable-next-line no-control-regex
const NAME_REGEX = /^([a-zA-Z.\xC0-\uFFFF]{1,60}[ \-']{0,3}){1,3}$/gi //This should allow unicode accented characters, but disallow most symbols

export function isEmail(possiblyEmail?: string, params?: any): boolean {
  return possiblyEmail ? possiblyEmail.match(EMAIL_REGEX) != null : false
}

export const checkName = (name: string): boolean => {
  return name ? name.match(NAME_REGEX) != null : false
}

/**
 * Add data types here to set up their validation
 */
const FieldTypes: ITypes = {
  empty: {
    errorMessage: 'This field is required.',
    callables: [
      { callable: (value: any): boolean => !!value, passResult: true },
    ],
  },
  email: {
    errorMessage: 'A valid email address is required.',
    callables: [
      { callable: isEmail, passResult: true }, //passResult is the result coming back from the callable to be VALID
    ],
  },
  name: {
    errorMessage: 'A valid name is required',
    callables: [{ callable: checkName, passResult: true }],
  },
  number: {
    errorMessage: 'Invalid data entered',
    callables: [
      {
        callable: (value: any, params: number): boolean => !isNaN(value),
        passResult: true,
      },
    ],
  },
  string: {
    errorMessage: 'Invalid value entered',
    callables: [
      {
        callable: (value: any): boolean =>
          typeof value === 'string' && value !== '',
        passResult: true,
      },
    ],
  },
  greaterThan: {
    errorMessage: 'Value below limit',
    callables: [
      {
        callable: (value: any, params: any): boolean => value > params,
        passResult: true,
      },
    ],
  },
  lessThan: {
    errorMessage: 'Value above limit',
    callables: [
      {
        callable: (value: any, params: any): boolean => value < params,
        passResult: true,
      },
    ],
  },
}

type ITypes = {
  [key: string]: {
    errorMessage: string
    callables: [{ callable: CallableFunction; passResult: boolean }]
  }
}

export type IFormFieldValidation = {
  [key: string]: {
    label?: string
    type?: 'checkbox' | 'text' | 'select'
    value?: any
    required?: boolean
    errors?: boolean
    errorMessages?: string
    customErrorMessage?: string
    checks?: Array<ISubFormFields>
  }
}

export type ISubFormFields = {
  name?: string
  type:
    | 'string'
    | 'name'
    | 'email'
    | 'number'
    | 'cc'
    | 'phone'
    | 'greaterThan'
    | 'lessThan'
    | 'equal'
    | 'inList'
    | 'date'
  params?: any
  errorMessage?: string
}

/**
 * Usage:
 *      const [formFields, setFormFields] = useState<IFormFieldValidation>({
 *          email: {
 *              required:true,
 *              checks:[{name:"Valid Email", type: "email"}]
 *          },
 *          firstName:{
 *              required:true,
 *              checks:[
 *                  {name:"First Name", type: "name"},
 *                  {name:"Email", type: "email"},
 *              ]
 *          },
 *          lastName:{
 *              required:true,
 *              checks:[{name:"Last Name", type: "name"}]
 *          }
 *      })
 *      const handleFieldUpdate = (fieldName: string, newValue: string | number) => {
 *          const newValidData = validateField(formFields, fieldName, newValue)
 *          setFormFields({...formFields, ...newValidData})
 *      }
 *
 *      Then call handleFieldUpdate from within onChange, onBlur, etc., on the input itself....
 */
export const validateField = (
  formFields: IFormFieldValidation,
  fieldName: string,
  value: any
): IFormFieldValidation => {
  //Check if there is even validation set up for this field, if not - return
  if (!formFields[fieldName]) {
    return formFields
  }

  let errorMessages: Array<string> = []
  formFields[fieldName].errors = false
  formFields[fieldName].errorMessages = ''
  formFields[fieldName].value = value

  //The value is empty, lets check if it's required....
  if (!formFields[fieldName].value) {
    if (formFields[fieldName].required) {
      errorMessages.push(FieldTypes.empty.errorMessage)
    }
  } else {
    formFields[fieldName].checks?.forEach(checkType => {
      if (FieldTypes[checkType.type]) {
        FieldTypes[checkType.type].callables.forEach(callableItem => {
          const params =
            typeof checkType.params !== undefined ? checkType.params : {}
          //console.log('validateField', checkType, checkType.params, fieldName, params)
          if (
            callableItem.passResult !== callableItem.callable(value, params)
          ) {
            errorMessages.push(FieldTypes[checkType.type].errorMessage)
          }
        })
      }
    })
  }
  if (errorMessages.length > 0) {
    formFields[fieldName].errors = true
    formFields[fieldName].errorMessages = errorMessages.join('. ')
  }
  return formFields
}

/**
 * Validates all data in the formFields array
 *
 * @param formFields<IFormFieldValidation>
 * @returns formFields<IFormFieldValidation>
 */
export const validateData = (
  formFields: IFormFieldValidation
): IFormFieldValidation => {
  //console.log('validateData', formFields)

  for (let fieldName in formFields) {
    formFields = validateField(
      formFields,
      fieldName,
      formFields[fieldName].value
    )
  }
  return formFields
}

export const resetErrors = (
  formFields: IFormFieldValidation
): IFormFieldValidation => {
  if (!formFields) {
    return formFields
  }

  for (let keys in formFields) {
    if (formFields[keys].errors) {
      delete formFields[keys]['errors']
    }
    if (formFields[keys].errorMessages) {
      delete formFields[keys]['errorMessages']
    }
    if (formFields[keys].value) {
      delete formFields[keys]['value']
    }
  }
  return formFields
}

/**
 * Checks object if there are any errors, returns TRUE if there are errors
 *
 * @param formFields
 * @returns Boolean
 */
export const hasErrors = (formFields: IFormFieldValidation): boolean => {
  if (!formFields) {
    return false
  }

  let thisHasErrors = false
  //console.log('FF', formFields)

  for (let keys in formFields) {
    if (formFields[keys].errors) {
      thisHasErrors = true
      break
    }
  }
  return thisHasErrors
}

/**
 * Set a errorMessage to a field
 * Usage:
 *  const newValidatedData = setError(formFields, 'institutionId', 'The Institution ID is needed')
 *  setFormFields({ ...formFields, ...newValidatedData })
 * @param formFields
 * @param fieldName
 * @param errorMessage
 * @returns
 */
export const setError = (
  formFields: IFormFieldValidation,
  fieldName: string,
  errorMessage: string
): IFormFieldValidation => {
  //Check if there is even validation set up for this field, if not - return
  if (!formFields[fieldName]) {
    return formFields
  }

  formFields[fieldName].errors = true
  formFields[fieldName].errorMessages = errorMessage

  return formFields
}
