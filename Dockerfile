# Gunakan image Node.js sebagai base image
FROM node:16

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

# Expose port 3100 untuk akses ke aplikasi
EXPOSE 3100

# Jalankan perintah start dengan Vite
CMD ["npm", "start"]