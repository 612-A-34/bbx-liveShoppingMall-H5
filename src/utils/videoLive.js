// 数字转化 人数转换
export const numberDisplayRules = number => {
  let formatNumber = '';
  if (typeof (number) === "string") {
    number = parseInt(number);
  }
  if (number > 9999) {
    formatNumber = (Math.floor(number / 1000) / 10) + 'W';
    // let frist_init=number.slice(0, number.length - 4); //取value后四位之外的数值，例如：32100 取3
    // let last_four=number.substr(number.length - 4); //取value后四位，例如：32100 取2100
    // formatNumber = `${frist_init}${last_four.slice(0,2) === "00"?"":"."+last_four.slice(0,2)}w`
  } else {
    formatNumber = number;
  }
  return formatNumber;
};

// uuid 
export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
// guid() // "a1ca0f7b-51bd-4bf3-a5d5-6a74f6adc1c7"
