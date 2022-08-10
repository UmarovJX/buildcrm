const scorePassword = (pass) => {
    let score = 0
    let length = 0
    let specialChar = 0
    let caseMix = 0
    let numCharMix = 0

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

    let uppercaseCount = 0
    pass.split('').map(item => {
        if (uppercaseRegex.test(item)) {
            console.log(item, 'item');
            uppercaseCount++
        }
    })
    console.log(uppercaseCount, 'uppercaseCount');


    if (pass.length > 4) {


        console.log(hasSpecialChar, 'hasSpecialChar');
        console.log(hasLowerCase, 'hasLowerCase');
        console.log(hasUpperCase, 'hasUpperCase');
        console.log(hasNumber, 'hasNumber');

        if ((hasLowerCase || hasUpperCase) && hasNumber) {
            numCharMix = 1
        }

        if (hasUpperCase && hasLowerCase) {
            caseMix = 1
        }

        if ((hasLowerCase || hasUpperCase || hasNumber) && hasSpecialChar) {
            specialChar = 1
        }

        if (pass.length > 8) {
            length = 1
        }

        if (pass.length > 12 && !hasRepeatChars) {
            length = 2
        }

        if (pass.length > 25 && !hasRepeatChars) {
            length = 3
        }

        score = length + specialChar + caseMix + numCharMix

        if (score > 4) {
            score = 4
        }
    }

    return score
}

export default scorePassword