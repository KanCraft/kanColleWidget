/* eslint-disable @typescript-eslint/no-unused-vars */
import { SyntheticEvent } from "react";

export interface ToolParams {
  fill?: boolean;
  color?: string;
}

export interface DrawPosition {
  x: number;
  y: number;
}

export default class DrawToolBase {

  // このへんはわかる
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  backup: ImageData;

  // なにこれ
  growth: number;
  cursor: string;

  constructor(canvas, params: ToolParams = {}) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.growth = this.canvas.width / this.canvas.offsetWidth;
    this.cursor = "default";
  }
  onStart(_ev: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    this.context.save();
    this.getBackup();
  }
  onMove(_ev: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    // TODO: 各Toolが実装する
  }
  onEnd(_ev: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    this.context.restore();
  }
  // Utilities
  position(ev: any): DrawPosition {
    return {
      x: ev.nativeEvent.offsetX * this.growth,
      y: ev.nativeEvent.offsetY * this.growth,
    };
  }
  getBackup() {
    this.backup = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }
  putBackup() {
    this.context.putImageData(this.backup, 0, 0);
  }
}