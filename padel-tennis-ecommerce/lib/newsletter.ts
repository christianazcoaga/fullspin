import { createClient as createBrowserClient } from "./supabase/client"

export async function subscribeToNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  const supabase = createBrowserClient()
  
  console.log("Intentando suscribir email:", email)
  
  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    console.log("Email inválido:", email)
    return { success: false, message: "Por favor ingresa un email válido" }
  }

  try {
    // Verificar si el email ya existe
    const { data: existingEmail, error: checkError } = await supabase
      .from("newsletter_subscribers")
      .select("email")
      .eq("email", email)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error("Error verificando email existente:", {
        message: checkError.message,
        code: checkError.code,
        details: checkError.details,
        hint: checkError.hint,
        fullError: checkError
      })
      return { success: false, message: "Error al verificar suscripción. Por favor intenta nuevamente." }
    }

    if (existingEmail) {
      console.log("Email ya existe:", email)
      return { success: false, message: "Este email ya está suscrito al newsletter" }
    }

    console.log("Email no existe, procediendo a insertar")

    // Insertar nuevo suscriptor
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .insert([
        {
          email: email,
          subscribed_at: new Date().toISOString(),
          is_active: true
        }
      ])
      .select()

    if (error) {
      console.error("Error inserting email subscription:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        fullError: error
      })
      return { success: false, message: "Error al suscribirse. Por favor intenta nuevamente." }
    }

    console.log("Suscripción por email exitosa:", data)
    return { success: true, message: "¡Te has suscrito exitosamente al newsletter!" }
  } catch (error) {
    console.error("Error subscribing to newsletter:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      fullError: error
    })
    return { success: false, message: "Error al suscribirse. Por favor intenta nuevamente." }
  }
}

export async function subscribePhoneToNewsletter(phone: string): Promise<{ success: boolean; message: string }> {
  const supabase = createBrowserClient()
  
  // Validar formato de teléfono (solo números, mínimo 10 dígitos)
  const phoneRegex = /^\d{10,20}$/
  const cleanPhone = phone.replace(/\s/g, '')
  
  if (!phoneRegex.test(cleanPhone)) {
    return { success: false, message: "Por favor ingresa un número de teléfono válido (mínimo 10 dígitos)" }
  }

  try {
    console.log("Intentando suscribir teléfono:", cleanPhone)
    
    // Primero intentar con la tabla de teléfonos
    try {
      // Verificar si el teléfono ya existe
      const { data: existingPhone, error: checkError } = await supabase
        .from("newsletter_phone_subscribers")
        .select("phone")
        .eq("phone", cleanPhone)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Error verificando teléfono existente:", checkError)
        throw new Error("Tabla de teléfonos no disponible")
      }

      if (existingPhone) {
        return { success: false, message: "Este número ya está suscrito al newsletter" }
      }

      // Insertar nuevo suscriptor
      const { data, error } = await supabase
        .from("newsletter_phone_subscribers")
        .insert([
          {
            phone: cleanPhone,
            is_active: true
          }
        ])
        .select()

      if (error) {
        console.error("Error inserting phone subscription:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          fullError: error
        })
        throw new Error(`Error en tabla de teléfonos: ${error.message}`)
      }

      console.log("Suscripción por teléfono exitosa:", data)
      return { success: true, message: "¡Te has suscrito exitosamente al newsletter por WhatsApp!" }
      
    } catch (tableError) {
      console.log("Tabla de teléfonos no disponible, usando tabla de email como fallback")
      
      // Fallback: usar la tabla de email con un formato especial
      const phoneEmail = `phone_${cleanPhone}@newsletter.local`
      
      // Verificar si ya existe
      const { data: existingEmail } = await supabase
        .from("newsletter_subscribers")
        .select("email")
        .eq("email", phoneEmail)
        .single()

      if (existingEmail) {
        return { success: false, message: "Este número ya está suscrito al newsletter" }
      }

      // Insertar en tabla de email como fallback
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert([
          {
            email: phoneEmail,
            subscribed_at: new Date().toISOString(),
            is_active: true
          }
        ])

      if (error) {
        console.error("Error inserting phone subscription in email table:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          fullError: error
        })
        return { success: false, message: "Error al suscribirse. Por favor intenta nuevamente." }
      }

      return { success: true, message: "¡Te has suscrito exitosamente al newsletter por WhatsApp!" }
    }
    
  } catch (error) {
    console.error("Error subscribing phone to newsletter:", error)
    return { success: false, message: "Error al suscribirse. Por favor intenta nuevamente." }
  }
} 