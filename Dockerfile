# Gunakan image Node.js sebagai base image
FROM node:18

# Set working directory ke /app
WORKDIR /app

# Salin package.json ke dalam container
COPY package*.json ./

# Instal dependencies
RUN npm install

# Salin kode aplikasi ke dalam container
COPY . .

# Jalankan perintah build
RUN npm run build

# Expose port 3000 untuk akses ke aplikasi
EXPOSE 8080

# Jalankan perintah start dengan Vite
CMD ["npm","run", "preview"]