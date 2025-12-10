import express from 'express'

// rolesAllowed can be array of role ids or role names depending on payload
export const authorizeRoles = (rolesAllowed = []) => {
  return (req, res, next) => {
    try {
      const user = req.user || {}
      const userRole = user.id_rol || user.idRol || (user.id && user.id.id_rol) || null
      if (!userRole) return res.status(403).json({ message: 'Acceso denegado: rol no encontrado' })

      // If rolesAllowed contains numbers, compare by id, otherwise compare by string
      const allowed = rolesAllowed.some(r => {
        if (typeof r === 'number') return r === Number(userRole)
        return String(r).toLowerCase() === String(userRole).toLowerCase()
      })

      if (!allowed) return res.status(403).json({ message: 'Acceso denegado: permiso insuficiente' })
      next()
    } catch (err) {
      console.error('authorizeRoles error:', err)
      return res.status(500).json({ message: 'Error en autorización' })
    }
  }
}

export default authorizeRoles
