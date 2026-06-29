const express = require('express');
const keepSupabase = require('../script/keepSupabase');
const router = express.Router()

router.get('/health', (req,res) => {
    res.json({
        success:true,
        status:'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    })
})

router.post('/keepalive-supabase', async (req,res) => {
    try{
        const result = await keepSupabase()
        res.json({
            success: result,
            message: result ? 'Supabase mantenido con exito' : 'Error al mantener Supabase',
            timestamp: new Date().toISOString()
        })
    } catch(error){
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        })
    }
})

router.get('/supabase-status', async (req, res) => {
    try {
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY
        );
        
        const { data, error } = await supabase
            .from('public')
            .select('count', { count: 'exact', head: true });
        
        if (error) {
            return res.status(500).json({
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
        
        res.json({
            success: true,
            status: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;