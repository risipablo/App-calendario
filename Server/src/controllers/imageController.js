
const { createClient } = require('@supabase/supabase-js');
const userModel = require('../models/userModel');
const supabase = require('../service/supabase')

const BUCKET_NAME = process.env.SUPABASE_BUCKET || 'avatars';



const bucket = supabase.storage.from('avatars'); 

exports.uploadProfileImage = async (req, res) => {
    try {
        // Verificar que req.user existe
        if (!req.user) {
            return res.status(401).json({ error: 'Usuario no autenticado correctamente' });
        }

        const userId = req.user._id || req.user.id;
        
        if (!userId) {
            return res.status(401).json({ error: 'ID de usuario no encontrado' });
        }

        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
        }

        // Buscar usuario en BD
        console.log('🔍 Buscando usuario en BD con ID:', userId);
        const user = await userModel.findById(userId);
        
        if (!user) {
            console.error('❌ Usuario NO encontrado en BD con ID:', userId);
            return res.status(404).json({ error: 'Usuario no encontrado en la base de datos' });
        }

        // Generar nombre único para la imagen
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        // Subir a Supabase
        console.log('🚀 Intentando subir a Supabase al bucket:', BUCKET_NAME);

        const { data, error: storageError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: true
            });
        
        if (storageError) {
            console.error('❌ ERROR CRÍTICO SUPABASE STORAGE:', storageError);
            return res.status(500).json({ 
                error: 'Error en Supabase Storage', 
                details: storageError.message,
                bucket: BUCKET_NAME
            });
        }

        console.log('✅ Imagen subida exitosamente a Supabase');

        // Obtener URL pública
        const { data: publicUrlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);

        const publicUrl = publicUrlData.publicUrl;

        // Eliminar avatar anterior si existe
        if (user.avatarPublicId) {
            try {
                await supabase.storage
                    .from(BUCKET_NAME)
                    .remove([user.avatarPublicId]);
                console.log('✅ Avatar anterior eliminado');
            } catch (removeError) {
                console.error('⚠️ Error eliminando avatar anterior:', removeError);
                // Continuar aunque falle la eliminación
            }
        }

        // Actualizar usuario en BD
        user.avatarUrl = publicUrl;
        user.avatarPublicId = filePath;

        if (user.role) {
            user.role = user.role.trim(); 
        }
        
        await user.save();

        console.log('✅ Usuario actualizado en BD');

        res.status(200).json({
            message: 'Imagen subida exitosamente',
            avatarUrl: publicUrl,
            avatarPublicId: filePath
        });

    } catch (error) {
        console.error('❌ Error general en uploadProfileImage:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor', 
            details: error.message 
        });
    }
};

exports.deleteProfileImage = async (req, res) => {
    
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        const userId = req.user._id || req.user.id;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (!user.avatarPublicId) {
            return res.status(404).json({ error: 'No hay imagen de perfil' });
        }

        console.log('Eliminando imagen:', user.avatarPublicId);

        // Eliminar de Supabase
        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([user.avatarPublicId]);

        if (error) {
            console.error('Error eliminando de Supabase:', error);
        }

        // Actualizar usuario
        user.avatarUrl = null;
        user.avatarPublicId = null;
        await user.save();

        res.status(200).json({ message: 'Imagen eliminada exitosamente' });

    } catch (error) {
        console.error('Error en deleteProfileImage:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getProfileImage = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        const userId = req.user._id || req.user.id;
        const user = await userModel.findById(userId).select('avatarUrl avatarPublicId');

        res.status(200).json({
            avatarUrl: user?.avatarUrl || null,
            hasAvatar: !!user?.avatarUrl
        });

    } catch (error) {
        console.error('Error en getProfileImage:', error);
        res.status(500).json({ error: error.message });
    }
};

// Ruta temporal para probar conexión
exports.testSupabaseConnection = async (req, res) => {
    try {
        const { data: buckets, error } = await supabase.storage.listBuckets();
        
        if (error) {
            return res.status(500).json({ 
                error: 'Error conectando a Supabase', 
                details: error.message 
            });
        }
        
        res.json({ 
            message: 'Conexión exitosa', 
            buckets: buckets.map(b => b.name),
            bucketExists: buckets.some(b => b.name === BUCKET_NAME)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};