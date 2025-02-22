'use client';

import { createNewDocument   } from '@/actions/actions';
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation';
import { useTransition } from 'react'


function NewDocumentButton() {
  const [isPinding, startTransition] = useTransition()
  const router = useRouter()
  const handleClickNewDocumat = () => {
    startTransition(async () => {
      // Create a new document
      const { docId } = await createNewDocument()
      console.log(docId)
      // Navigate to the new document
      router.push(`/doc/${docId}`)

    })
  }

  return (
    <div>
      <Button onClick={() => handleClickNewDocumat()} disabled={isPinding}>
        {isPinding ? 'Creating...' : 'New Document'}
      </Button>
    </div>
  )
}

export default NewDocumentButton
