# API-vehicles-fis2020

The code of the vehicles service for FIS2020

URLs:

GET /api/v1/vehicles -- get all vehicles
GET /api/v1/vehicles?localizacion={param}&estado={param2} -- get con los filtros que se prefieran
GET /api/v1/vehicles/{matricula} -- get info del coche con esa matricula

POST /api/v1/vehicles -- postea un vehiculo pasado por body si todos sus campos son validos

PUT /api/v1/vehicles/{matricula} -- actualiza el vehiculo cuya matricula coincida con la url con el vehiculo pasado por body si sus campos son validos

PATCH /api/v1/vehicles/{matricula} -- modifica del vehiculo que matricula coincide con solo los campos que se le pasen en body (si son validos)

DELETE /api/v1/vehicles/{matricula} -- elimina el vehiculo con la matricula pasasda por url
