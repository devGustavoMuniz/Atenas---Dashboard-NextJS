"use client";

import { useEdgeStore } from "../../../lib/edgestore";
import { useState } from "react";
import Link from "next/link";

const PhysicalAlbumPage = () => {
  const [file, setFile] = useState();
  const [urls, setUrls] = useState();
  const { edgestore } = useEdgeStore();

  return (
    <div className="flex flex-col items-center m-6 gap-2">
      <input type="file" onChange={(e) => {
        setFile(e.target.files?.[0])
      }} />
      <button
      className="bg-white text-black rounded px-2 hover:opacity-80"
      onClick={async () => {
        if (file) {
          const res = await edgestore.myPublicImages.upload({file})
          setUrls({
            url: res.url,
            thumbnailUrl: res.thumbnailUrl,
          })
        }
      }}
      >upload</button>
      {urls?.url && <Link href={urls.url} target="_blank">URL</Link>}
      {urls?.thumbnailUrl && <Link href={urls.thumbnailUrl} target="_blank">THHUMBNAIL URL</Link>}
    </div>
  )
}

export default PhysicalAlbumPage