import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PostMedia from "../PostMedia";

const wrap = (ui: React.ReactNode) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe("PostMedia", () => {
  it("renders an image post", () => {
    wrap(
      <PostMedia mediaType="image" image="https://cdn.example/x.jpg" alt="a cat" />
    );
    expect(screen.getByAltText("a cat")).toBeInTheDocument();
  });

  it("renders a muted, looping video for video posts", () => {
    const { container } = wrap(
      <PostMedia mediaType="video" video="https://cdn.example/x.mp4" />
    );
    const video = container.querySelector("video");
    expect(video).toBeTruthy();
    expect(video).toHaveAttribute("loop");
    expect(video?.muted).toBe(true);
  });

  it("renders a play control for image + audio posts", () => {
    wrap(
      <PostMedia
        mediaType="audioImage"
        image="https://cdn.example/x.jpg"
        audio="https://cdn.example/x.mp3"
        audioMeta={{ trackName: "Song", startSec: 0, endSec: 10 }}
      />
    );
    expect(
      screen.getByRole("button", { name: /play audio/i })
    ).toBeInTheDocument();
  });

  it("renders nothing without usable media", () => {
    const { container } = wrap(<PostMedia mediaType="image" />);
    expect(container).toBeEmptyDOMElement();
  });
});
