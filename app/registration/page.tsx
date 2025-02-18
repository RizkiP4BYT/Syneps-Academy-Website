'use client'

import * as React from 'react';
import { Container, Typography, Card, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Select, MenuItem, TextField, Button, Checkbox } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import CustomTextField from '@/app/components/CustomTextField';

const RegistrationForm = () => {
  const [program, setProgram] = React.useState('bootcamp');
  const [selectedProgram, setSelectedProgram] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [batch, setBatch] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [birthDate, setBirthDate] = React.useState<Date>(new Date());
  const [education, setEducation] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [emergencyPhone, setEmergencyPhone] = React.useState('');
  const [city, setCity] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [source, setSource] = React.useState('');
  const [motivation, setMotivation] = React.useState('');
  const [paymentMethod, setPaymentMethod] = React.useState('upfrontPayment');
  const [referralCode, setReferralCode] = React.useState('');
  const [agreeTerms, setAgreeTerms] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      program,
      selectedProgram,
      location,
      batch,
      firstName,
      lastName,
      email,
      gender,
      birthDate,
      education,
      phone,
      emergencyPhone,
      city,
      address,
      source,
      motivation,
      paymentMethod,
      referralCode,
      agreeTerms,
    });
    // Add your form submission logic here
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          Formulir Pendaftaran
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          Khusus Program Bootcamp, setelah kirim formulir kamu akan pindah ke halaman registration fee Rp100rb untuk
          amankan kursimu sebelum kuota penuh!
        </Typography>

        <Card sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Pilih Program yang Ingin Diambil
          </Typography>
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <RadioGroup
              row
              value={program}
              onChange={(e) => setProgram(e.target.value)}
            >
              <FormControlLabel
                value="bootcamp"
                control={<Radio />}
                label={
                  <>
                    <Typography fontWeight="bold">Bootcamp</Typography>
                    <Typography variant="body2">
                      Program pembelajaran full-time yang di bidang IT dengan jadwal belajar intensif.
                    </Typography>
                  </>
                }
              />
              <FormControlLabel
                value="upskilling"
                control={<Radio />}
                label={
                  <>
                    <Typography fontWeight="bold">Professional Development</Typography>
                    <Typography variant="body2">
                      Program pembelajaran di luar jam kerja untuk upskilling di bidang IT.
                    </Typography>
                  </>
                }
              />
            </RadioGroup>
          </FormControl>

          <form onSubmit={handleSubmit}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <FormLabel>Pilih Program</FormLabel>
              <Select
                name="selectedProgram"
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
              >
                <MenuItem value="">Select...</MenuItem>
                {/* Add more MenuItem components as needed */}
              </Select>
            </FormControl>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <FormLabel>Pilih Lokasi</FormLabel>
                <Select
                  name="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <MenuItem value="">Select...</MenuItem>
                  {/* Add more MenuItem components as needed */}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <FormLabel>Pilih Batch</FormLabel>
                <Select
                  name="batch"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                >
                  <MenuItem value="">Select...</MenuItem>
                  {/* Add more MenuItem components as needed */}
                </Select>
              </FormControl>
            </div>

            <Typography variant="h6" gutterBottom>
              Informasi Data Diri
            </Typography>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <CustomTextField
                fullWidth
                label="Nama Depan Sesuai KTP"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <CustomTextField
                fullWidth
                label="Nama Belakang Sesuai KTP"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <CustomTextField
                fullWidth
                label="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormControl fullWidth>
                <FormLabel>Jenis Kelamin</FormLabel>
                <Select
                  name="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <MenuItem value="">Select...</MenuItem>
                  {/* Add more MenuItem components as needed */}
                </Select>
              </FormControl>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <DatePicker
                label="Tanggal Lahir"
                value={birthDate}
                onChange={e => setBirthDate(e!)}
                format='dd MMMM yyyy'
                slots={{
                  textField: CustomTextField
                }}
                slotProps={{
                  textField: { fullWidth: true, required: true }
                }}
              />
              <FormControl fullWidth>
                <FormLabel>Pendidikan Terakhir</FormLabel>
                <Select
                  name="education"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                >
                  <MenuItem value="">Select...</MenuItem>
                  {/* Add more MenuItem components as needed */}
                </Select>
              </FormControl>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <CustomTextField
                fullWidth
                label="No Hp"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <CustomTextField
                fullWidth
                label="Nomor HP Kerabat Tidak Serumah"
                name="emergencyPhone"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
              />
            </div>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <FormLabel>Kota Domisili</FormLabel>
              <Select
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <MenuItem value="">Select...</MenuItem>
                {/* Add more MenuItem components as needed */}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <FormLabel>Alamat Lengkap</FormLabel>
              <TextField
                multiline
                rows={3}
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
              />
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <FormLabel>Darimana Mengetahui Program Ini</FormLabel>
              <Select
                name="source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              >
                <MenuItem value="">Select...</MenuItem>
                {/* Add more MenuItem components as needed */}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <FormLabel>Apa motivasi kamu mengikuti program ini?</FormLabel>
              <Select
                name="motivation"
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
              >
                <MenuItem value="">Select...</MenuItem>
                {/* Add more MenuItem components as needed */}
              </Select>
            </FormControl>

            <Typography variant="h5" gutterBottom>
              Metode Pembayaran
            </Typography>
            <Typography variant="h6" gutterBottom>
              Pilih Metode Pembayaran
            </Typography>
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <RadioGroup
                row
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  value="upfrontPayment"
                  control={<Radio />}
                  label={
                    <>
                      <Typography fontWeight="bold">Upfront</Typography>
                      <Typography variant="body2">Pelunasan di awal</Typography>
                    </>
                  }
                />
                <FormControlLabel
                  value="installmentPayment"
                  control={<Radio />}
                  label={
                    <>
                      <Typography fontWeight="bold">Cicilan 0%</Typography>
                      <Typography variant="body2">Cicilan tanpa bunga</Typography>
                    </>
                  }
                />
                <FormControlLabel
                  value="snplPayment"
                  control={<Radio />}
                  label={
                    <>
                      <Typography fontWeight="bold">SNPL</Typography>
                      <Typography variant="body2">Biaya dicicil setelah lulus</Typography>
                    </>
                  }
                />
              </RadioGroup>
            </FormControl>

            <CustomTextField
              fullWidth
              label="Kode Referal"
              name="referralCode"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              sx={{ mb: 3 }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  name="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
              }
              label="Dengan mengirim formulir ini saya menyetujui Syarat dan Ketentuan untuk mengikuti program yang saya daftarkan."
              sx={{ mb: 3 }}
            />

            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ py: 2, fontWeight: 'bold' }}>
              Kirim Formulir
            </Button>
          </form>
        </Card>
      </Container>
    </LocalizationProvider>
  );
};

export default RegistrationForm;