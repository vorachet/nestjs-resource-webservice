
# Create NestJS project with current directory

```
nest new <PROJECT_NAME> --directory .
```

## Creating new resource using WebSocket interface

```

$ npm install --save @nestjs/websockets
$ npm install --save @nestjs/platform-socket.io

$ nest g res CustomerResource


? What transport layer do you use? WebSockets
? Would you like to generate CRUD entry points? Yes
CREATE src/customer-resource/customer-resource.gateway.spec.ts (627 bytes)
CREATE src/customer-resource/customer-resource.gateway.ts (1307 bytes)
CREATE src/customer-resource/customer-resource.module.ts (300 bytes)
CREATE src/customer-resource/customer-resource.service.spec.ts (531 bytes)
CREATE src/customer-resource/customer-resource.service.ts (777 bytes)
CREATE src/customer-resource/dto/create-customer-resource.dto.ts (42 bytes)
CREATE src/customer-resource/dto/update-customer-resource.dto.ts (233 bytes)
CREATE src/customer-resource/entities/customer-resource.entity.ts (33 bytes)
UPDATE package.json (2015 bytes)
UPDATE src/app.module.ts (358 bytes)
✔ Packages installed successfully.
```