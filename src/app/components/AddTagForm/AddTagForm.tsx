'use client'

import React, { useState } from 'react'
import style from "./AddTagForm.module.css"
import router, { useRouter } from 'next/navigation'

function AddTagForm() {
  const router = useRouter();
  
  const [newTag, setNewTag] = useState("")

  const handleSubmit = async () => {
    const res = await fetch("http://localhost:3000/api/tags", {
      method: "POST",
      headers: { "Content-Type": "aplication/json" },
      body: JSON.stringify(newTag),
    });

    if (res.status === 200 || res.status === 201) {
      router.refresh();
    }

    setNewTag("")
  }

  return (
    <div>
      <form className={style.inputForm} onSubmit={handleSubmit}>
        <h3>Add new Tag</h3>
        <input
          type="text"
          placeholder='New tag name...'
          value={newTag}
          onChange={(e) => {
            setNewTag(e.target.value)
          }}
        />
        <button>ADD</button>
      </form>
    </div>
  )
}

export default AddTagForm