import type { Player } from "./entities/Player";

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

  private drawTriangle(
    x: number,
    y: number,
    angle: number,
    size: number,
    color: string = "black",
  ) {
    this.ctx.save();

    this.ctx.translate(x, y);
    this.ctx.rotate(angle);

    this.ctx.beginPath();
    this.ctx.moveTo(size, 0); // Tip of the ship
    this.ctx.lineTo(-size, size / 1.5); // Rear right
    this.ctx.lineTo(-size, -size / 1.5); // Rear left
    this.ctx.closePath();
    this.ctx.fillStyle = color;
    this.ctx.fill();

    this.ctx.restore();
  }

  drawPlayer(player: Player) {
    const positions = this.getRenderPositions(player.x, player.y, player.size);
    for (const pos of positions) {
      this.drawTriangle(pos.x, pos.y, player.angle, player.size);
    }
  }

  private getRenderPositions(x: number, y: number, size: number) {
    const positions = [{ x, y }];
    const nearLeft = x < size;
    const nearRight = x > this.width - size;
    const nearTop = y < size;
    const nearBottom = y > this.height - size;

    if (nearLeft) positions.push({ x: x + this.width, y: y });

    if (nearRight) positions.push({ x: x - this.width, y: y });

    if (nearTop) positions.push({ x: x, y: y + this.height });

    if (nearBottom) positions.push({ x: x, y: y - this.height });

    // Diagonals
    if (nearLeft && nearTop)
      positions.push({ x: x + this.width, y: y + this.height });

    if (nearLeft && nearBottom)
      positions.push({ x: x + this.width, y: y - this.height });

    if (nearRight && nearTop)
      positions.push({ x: x - this.width, y: y + this.height });

    if (nearRight && nearBottom)
      positions.push({ x: x - this.width, y: y - this.height });

    return positions;
  }
}
