import subprocess
import tempfile
import os

def analyze_code(code):
    # Buat file sementara untuk dibaca oleh linter
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as temp_file:
        temp_file.write(code)
        temp_file_path = temp_file.name

    try:
        # Jalankan flake8 (pastikan flake8 terinstal di virtual env Anda)
        result = subprocess.run(
            ['flake8', temp_file_path],
            capture_output=True,
            text=True
        )
        
        if result.stdout:
            # Bersihkan nama path file sementara dari output
            issues = [line.replace(temp_file_path, 'Baris ') for line in result.stdout.split('\n') if line]
            return issues
            
        return ["Tidak ditemukan masalah statis (Kode bersih)."]
        
    except FileNotFoundError:
        return ["Error: flake8 tidak terinstal di sistem/venv."]
    except Exception as e:
        return [f"Kesalahan Analisis Statis: {str(e)}"]
    finally:
        # Pastikan sampah file sementara selalu dihapus
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)