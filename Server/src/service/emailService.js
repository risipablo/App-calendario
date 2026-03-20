const {Resend} = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

const sendPasswordEmail = async(email,resetToken, userName = 'Usuario') => {

    const resultUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

    try{
        const {data,error} = await resend.emails.send({
            from: 'Tu App <noreply@tudominio.com>',
            to: [email],
            subject: 'Recuperación de contraseña',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">Recuperación de Contraseña</h1>
                    </div>
                    
                    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
                        <p style="font-size: 16px;">Hola <strong>${userName}</strong>,</p>
                        
                        <p style="font-size: 16px;">Recibimos una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el siguiente botón para crear una nueva contraseña:</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resultUrl}" 
                               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                      color: white; 
                                      padding: 14px 28px; 
                                      text-decoration: none; 
                                      border-radius: 8px; 
                                      font-size: 16px;
                                      font-weight: bold;
                                      display: inline-block;
                                      box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                Restablecer Contraseña
                            </a>
                        </div>
                        
                        <p style="font-size: 14px; color: #666;">Este enlace expirará en <strong>15 minutos</strong>.</p>
                        
                        <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p style="font-size: 14px; margin: 0; word-break: break-all;">
                                <strong>O copia este enlace en tu navegador:</strong><br>
                                <a href="${resultUrl}" style="color: #667eea;">${resultUrl}</a>
                            </p>
                        </div>
                        
                        <p style="font-size: 14px; color: #666; margin-top: 25px;">
                            Si no solicitaste este cambio, puedes ignorar este email o contactar a soporte si tienes dudas.
                        </p>
                        
                        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 25px 0;">
                        
                        <p style="font-size: 12px; color: #999; text-align: center;">
                            © ${new Date().getFullYear()} Tu App. Todos los derechos reservados.
                        </p>
                    </div>
                </body>
                </html>
            `
        })

        
        if (error) {
            console.error('Error de Resend:', error);
            throw new Error(error.message);
        }

        
        console.log('Email enviado:', data);
        return { success: true, data };

    } catch (error) {
        console.error('Error enviando email:', error);
        throw error;
    }
}

module.exports = {
    sendPasswordEmail
}




