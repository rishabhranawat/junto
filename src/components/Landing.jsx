'use client'

import ContextTextField from "./ContextTextField"
import Content from '@/components/Content'

export default function Landing() {

    return (
      <div className="p-24">
        <ContextTextField onSubmit={(input) => {}}/>

        <Content />         
      </div>
    )
  }