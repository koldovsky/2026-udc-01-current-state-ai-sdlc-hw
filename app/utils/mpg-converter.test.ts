import { mpgToL100km } from './mpg-converter'

describe('mpgToL100km', () => {
  it('converts 20 mpg to 11.76 L/100km', () => {
    expect(mpgToL100km(20)).toBe(11.76)
  })

  it('converts 30 mpg to 7.84 L/100km', () => {
    expect(mpgToL100km(30)).toBe(7.84)
  })

  it('converts 40 mpg to 5.88 L/100km', () => {
    expect(mpgToL100km(40)).toBe(5.88)
  })

  it('returns NaN for 0 mpg', () => {
    expect(mpgToL100km(0)).toBeNaN()
  })

  it('returns NaN for negative mpg', () => {
    expect(mpgToL100km(-10)).toBeNaN()
  })

  it('rounds using HALF_UP at 2 decimal places', () => {
    // 235.214583 / 50 = 4.70429166... → rounds to 4.70
    expect(mpgToL100km(50)).toBe(4.70)
    // 235.214583 / 25 = 9.40858332... → rounds to 9.41
    expect(mpgToL100km(25)).toBe(9.41)
  })
})
