let vchart_editor_id = 0;
const vchart_editor_id_max = 9999999;
export function CreateID() {
  if (vchart_editor_id >= vchart_editor_id_max) {
    vchart_editor_id = 0;
  }
  return vchart_editor_id++;
}
