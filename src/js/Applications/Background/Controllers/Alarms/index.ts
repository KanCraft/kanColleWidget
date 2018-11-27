import TempStorage from "../../../../Services/TempStorage";
import WindowService from "../../../../Services/Window";

export async function Screenshot(alarm: any) {
  const params = alarm.params as URLSearchParams;
  const uri = decodeURIComponent(params.get("uri"));
  const storage = new TempStorage();
  WindowService.getInstance().openCapturePage({key: storage.store("uri", uri)});
  return {status: 202};
}
