"use client"

import BgRemove from "./bg-remove"
import AIBackgroundReplace from "./bg-replace"
import ExtractPart from "./extract-part"
import GenRemove from "./gen-remove"
import GenerativeFill from "./generative-fill"
import AIRecolor from "./recolor"

export default function ImageTools() {
  return (
    <nav className="w-28 flex flex-col gap-3">
      <GenerativeFill />
      <AIRecolor />
      <GenRemove />
      <AIBackgroundReplace />
      <ExtractPart />
      <BgRemove />
    </nav>
  )
}
