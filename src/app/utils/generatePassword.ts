export const generatePassword = (
  length = 8,
  wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', // concat ~!@-#$ for special
) =>
  Array.from(crypto.getRandomValues(new Uint32Array(length)))
    .map(x => wishlist[x % wishlist.length])
    .join('')

// export const randPassword = (
//   uppersCase: number,
//   numbers: number,
//   lowersCase: number,
// ) => {
//   const chars = [
//     'ABCDEFGHIJKLMNOPQRSTUVWXYZ', // letters
//     '0123456789', // numbers
//     'abcdefghijklmnopqrstuvwxyz0123456789', // either
//   ]

//   return [uppersCase, numbers, lowersCase]
//     .map(function (len, i) {
//       return Array(len)
//         .fill(chars[i])
//         .map(function (x) {
//           return x[Math.floor(Math.random() * x.length)]
//         })
//         .join('')
//     })
//     .concat()
//     .join('')
//     .split('')
//     .sort(function () {
//       return 0.5 - Math.random()
//     })
//     .join('')
// }
