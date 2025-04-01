import Enum from '../enum'

/**
 * 枚举类：商品规格类型
 * SpecTypeEnum
 */
export default new Enum([
  { key: 'SINGLE', name: '单规格', value: 10 },
  { key: 'MULTI', name: '多选多规格', value: 20 },
  { key: 'MULTI_SINGLE', name: '单选多规格', value: 30 }
])
