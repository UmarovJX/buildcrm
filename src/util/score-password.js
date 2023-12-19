const scorePassword = pass => {
  let score = 0
  let length = 0
  let specialChar = 0
  let caseMix = 0
  let numCharMix = 0
  // let uppercaseCount = 0

  const specialCharRegex = /[^A-Za-z0-9]/g
  const lowercaseRegex = /(.*[a-z].*)/g
  const uppercaseRegex = /(.*[A-Z].*)/g
  const numberRegex = /(.*[0-9].*)/g
  const repeatCharRegex = /(\w)(\1+\1+\1+\1+)/g

  const hasSpecialChar = specialCharRegex.test(pass)
  const hasLowerCase = lowercaseRegex.test(pass)
  const hasUpperCase = uppercaseRegex.test(pass)
  const hasNumber = numberRegex.test(pass)
  const hasRepeatChars = repeatCharRegex.test(pass)

  // pass.split('').map(item => {
  //     if (item === item.toUpperCase() && !(item.toLowerCase() === item.toUpperCase())) {
  //         return uppercaseCount++
  //     }
  // })

  if (pass.length > 7) {
    if (pass.length > 7) {
      length = 0

      if ((hasLowerCase || hasUpperCase) && hasNumber) {
        numCharMix = 1
      }

      if (hasUpperCase && hasLowerCase) {
        caseMix = 1
      }

      if ((hasLowerCase || hasUpperCase || hasNumber) && hasSpecialChar) {
        specialChar = 1
      }
    }

    if (pass.length > 12 && !hasRepeatChars) {
      length = 1

      if ((hasLowerCase || hasUpperCase) && hasNumber) {
        numCharMix = 1
      }

      if (hasUpperCase && hasLowerCase) {
        caseMix = 1
      }

      if ((hasLowerCase || hasUpperCase || hasNumber) && hasSpecialChar) {
        specialChar = 1
      }
    }

    if (pass.length > 16 && !hasRepeatChars) {
      length = 2

      if ((hasLowerCase || hasUpperCase) && hasNumber) {
        numCharMix = 1
      }

      if (hasUpperCase && hasLowerCase) {
        caseMix = 1
      }

      if ((hasLowerCase || hasUpperCase || hasNumber) && hasSpecialChar) {
        specialChar = 1
      }
    }

    score = length + specialChar + caseMix + numCharMix

    if (score > 3) {
      // if (hasLowerCase && hasUpperCase && hasNumber) {
      score = 4
      // } else {
      //     score = 3
      // }
    }
  }

  return score
}

export default scorePassword
