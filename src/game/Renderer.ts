export class Renderer {
  private ctx: CanvasRenderingContext2D;
  readonly width: number;
  readonly height: number;

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No 2D context");

    this.ctx = ctx;
    this.width = canvas.width;
    this.height = canvas.height;
  }

  clear() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset any transformations
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  drawCircle(x: number, y: number, radius: number) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawShip(x: number, y: number, angle: number, size: number) {
    this.ctx.save();

    this.ctx.translate(x, y);
    this.ctx.rotate(angle);

    this.ctx.beginPath();
    this.ctx.moveTo(size, 0); // Tip of the ship
    this.ctx.lineTo(-size, size / 1.5); // Rear right
    this.ctx.lineTo(-size, -size / 1.5); // Rear left
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.restore();
  }
}
