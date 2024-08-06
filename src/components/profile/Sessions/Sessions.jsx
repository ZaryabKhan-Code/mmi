import React from 'react'
import { useLocation } from 'react-router-dom'
import SessionsTab from './SessionsTab'
import ProgressSession from './ProgressSession'

const Sessions = () => {
    const { search } = useLocation()
    const queryParams = new URLSearchParams(search)
    const type = queryParams.get('type')
    const id = queryParams.get('id')

    if (type === 'completed' && id) {
        return <ProgressSession id={id} type={'completed'} />
    }
    else if (type === 'archived' && id) {
        return <ProgressSession id={id} />
    }
    else if (type === "in-progress" && id) {
        return <ProgressSession id={id} type={'in-progress'} />
    }

    return <SessionsTab />
}

export default Sessions
