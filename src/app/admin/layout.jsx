import AdminNavbar from '@/components/AdminNavbar'
import React from 'react'

const layout = ({ children }) => {
    return (
        <div>
            <AdminNavbar />
            {children}
        </div>
    )
}

export default layout