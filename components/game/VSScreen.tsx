"use client";

export function VSScreen({
  player1Name,
  player2Name,
}: {
  player1Name: string;
  player2Name: string;
}) {
  // TBD: VS splash animation
  return <div data-p1={player1Name} data-p2={player2Name} />;
}
