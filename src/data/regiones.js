/* ============================================
   ProSetup - Regiones y comunas de Chile
   Arreglo complementario usado por los select dependientes
   Región -> Comuna (registro, checkout y mantenedor de usuarios).
   ============================================ */

export const REGIONES_CHILE = [
    {
        region: "Región de Arica y Parinacota",
        comunas: ["Arica", "Camarones", "Putre", "General Lagos"]
    },
    {
        region: "Región de Tarapacá",
        comunas: ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"]
    },
    {
        region: "Región de Antofagasta",
        comunas: ["Antofagasta", "Calama", "Tocopilla", "Mejillones", "Taltal", "San Pedro de Atacama"]
    },
    {
        region: "Región de Atacama",
        comunas: ["Copiapó", "Caldera", "Chañaral", "Vallenar", "Huasco", "Diego de Almagro"]
    },
    {
        region: "Región de Coquimbo",
        comunas: ["La Serena", "Coquimbo", "Ovalle", "Illapel", "Vicuña", "Andacollo", "Salamanca"]
    },
    {
        region: "Región de Valparaíso",
        comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "San Antonio", "Los Andes", "Quillota", "Casablanca", "La Ligua"]
    },
    {
        region: "Región Metropolitana de Santiago",
        comunas: ["Santiago", "Providencia", "Las Condes", "Maipú", "Puente Alto", "La Florida", "Ñuñoa", "San Bernardo", "Vitacura", "Recoleta", "Independencia", "La Reina"]
    },
    {
        region: "Región del Libertador Gral. Bernardo O'Higgins",
        comunas: ["Rancagua", "San Fernando", "Rengo", "Santa Cruz", "Pichilemu", "Machalí"]
    },
    {
        region: "Región del Maule",
        comunas: ["Talca", "Curicó", "Linares", "Constitución", "Cauquenes", "San Javier"]
    },
    {
        region: "Región de Ñuble",
        comunas: ["Chillán", "Chillán Viejo", "San Carlos", "Bulnes", "Quirihue"]
    },
    {
        region: "Región del Biobío",
        comunas: ["Concepción", "Talcahuano", "Los Ángeles", "Coronel", "San Pedro de la Paz", "Chiguayante", "Lota"]
    },
    {
        region: "Región de La Araucanía",
        comunas: ["Temuco", "Padre Las Casas", "Villarrica", "Angol", "Pucón", "Victoria"]
    },
    {
        region: "Región de Los Ríos",
        comunas: ["Valdivia", "La Unión", "Río Bueno", "Panguipulli", "Los Lagos"]
    },
    {
        region: "Región de Los Lagos",
        comunas: ["Puerto Montt", "Puerto Varas", "Osorno", "Castro", "Ancud", "Quellón", "Chonchi", "Frutillar"]
    },
    {
        region: "Región de Aysén",
        comunas: ["Coyhaique", "Puerto Aysén", "Chile Chico", "Cochrane"]
    },
    {
        region: "Región de Magallanes y de la Antártica Chilena",
        comunas: ["Punta Arenas", "Puerto Natales", "Porvenir", "Puerto Williams"]
    }
];

// Devuelve la lista de comunas de una región (o [] si la región no existe)
export function obtenerComunas(nombreRegion) {
    const region = REGIONES_CHILE.find(r => r.region === nombreRegion);
    return region ? region.comunas : [];
}
