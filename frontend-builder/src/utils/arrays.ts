export const arrayXor = <T>(array: Array<T> | undefined, item: T): Array<T> => {
  if (!array) {
    return [item]
  }

  if (array.includes(item)) {
    return array.filter(el => el !== item)
  } else {
    return array.concat([item])
  }
}
