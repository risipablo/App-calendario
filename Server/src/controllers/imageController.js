
const { createClient } = require('@supabase/supabase-js');
const userModel = require('../models/userModel');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const BUCKET_NAME = process.env.SUPABASE_BUCKET || 'avatars';

const supabase = createClient(supabaseUrl, supabaseServiceKey);


exports.uploadProfileImage = async (req, res) => {
    
    
    // console.log('req.user:', req.user ? {
    //     id: req.user._id,
    //     email: req.user.email,
    //     name: req.user.name
    // } : 'NO HAY req.user');
    // console.log(' req.file:', req.file ? {
    //     originalname: req.file.originalname,
    //     size: req.file.size,
    //     mimetype: req.file.mimetype
    // } : 'NO HAY archivo');
    
    
    
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

        
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
            return res.status(400).json({ 
                error: 'Formato no permitido. Usa JPEG, PNG o WEBP' 
            });
        }

        // Validar tamaño (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            return res.status(400).json({ error: 'La imagen no debe superar los 2MB' });
        }

        // Buscar usuario en BD
        console.log('🔍 Buscando usuario en BD con ID:', userId);
        const user = await userModel.findById(userId);
        
        if (!user) {
            console.error('❌ Usuario NO encontrado en BD con ID:', userId);
            return res.status(404).json({ error: 'Usuario no encontrado en la base de datos' });
        }

        console.log('✅ Usuario encontrado:', {
            id: user._id,
            email: user.email,
            name: user.name,
            hasAvatar: !!user.avatarUrl
        });

        // Generar nombre único para la imagen
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        // Subir a Supabase
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                cacheControl: '3600',
                upsert: true
            });

        if (error) {
            return res.status(500).json({ error: 'Error al subir la imagen: ' + error.message });
        }

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
            } catch (removeError) {
                console.error('⚠️ Error eliminando avatar anterior:', removeError);
                
            }
        }

        // Actualizar usuario en BD
        user.avatarUrl = publicUrl;
        user.avatarPublicId = filePath;
        await user.save();

        
        

        res.status(200).json({
            message: 'Imagen subida exitosamente',
            avatarUrl: publicUrl,
            avatarPublicId: filePath
        });

    } catch (error) {

        res.status(500).json({ error: error.message });
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