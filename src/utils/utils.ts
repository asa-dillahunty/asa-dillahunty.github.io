export function classCombine(...classNames: (string | undefined)[]) {
  let final = "";
  if (classNames && classNames[0]) {
    final = classNames[0];
  }
  for (let i = 1; i < classNames.length; i++) {
    if (classNames[i]) final += ` ${classNames[i]}`;
  }
  return final;
}
