export const format = date => {
  var m = date.getMonth() + 1;
  var d = date.getDate();
  var w = date.getDay();
  var wNames = ["日", "月", "火", "水", "木", "金", "土"];
  if (m < 10) {
    m = "0" + m;
  }
  if (d < 10) {
    d = "0" + d;
  }
  return m + "/" + d + "(" + wNames[w] + ")";
};
