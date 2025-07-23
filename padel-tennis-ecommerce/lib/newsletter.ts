import { createClient as createBrowserClient } from "./supabase/client"

export async function subscribeToNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  const supabase = createBrowserClient()
  
  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { success: false, message: "Por favor ingresa un email válido" }
  }

  try {
    // Verificar si el email ya existe
    const { data: existingEmail } = await supabase
      .from("newsletter_subscribers")
      .select("email")
      .eq("email", email)
      .single()

    if (existingEmail) {
      return { success: false, message: "Este email ya está suscrito al newsletter" }
    }

    // Insertar nuevo suscriptor
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert([
        {
          email: email,
          subscribed_at: new Date().toISOString(),
          is_active: true
        }
      ])

    if (error) {
      console.error("Error subscribing to newsletter:", error)
      return { success: false, message: "Error al suscribirse. Por favor intenta nuevamente." }
    }

    return { success: true, message: "¡Te has suscrito exitosamente al newsletter!" }
  } catch (error) {
    console.error("Error subscribing to newsletter:", error)
    return { success: false, message: "Error al suscribirse. Por favor intenta nuevamente." }
  }
} 