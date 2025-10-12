import { useCurrentUser } from './useCurrentUser'

export function useUserRole() {
  const user = useCurrentUser()
  return user ? user.roles.map((role) => role.name) : null
}
