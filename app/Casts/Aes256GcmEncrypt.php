<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

class Aes256GcmEncrypt implements CastsAttributes
{
    /**
     * Cast the given value (decrypt it on retrieval).
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): mixed
    {
        if (empty($value)) {
            return $value;
        }

        try {
            $data = json_decode(base64_decode($value), true);
            if (!$data || !isset($data['ciphertext'], $data['iv'], $data['tag'])) {
                return $value;
            }

            $keyRaw = $this->getEncryptionKey();
            $decrypted = openssl_decrypt(
                base64_decode($data['ciphertext']),
                'aes-256-gcm',
                $keyRaw,
                OPENSSL_RAW_DATA,
                base64_decode($data['iv']),
                base64_decode($data['tag'])
            );

            return $decrypted === false ? $value : $decrypted;
        } catch (\Exception $e) {
            return $value;
        }
    }

    /**
     * Prepare the given value for storage (encrypt it).
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): mixed
    {
        if (empty($value)) {
            return $value;
        }

        try {
            $keyRaw = $this->getEncryptionKey();
            $ivLength = openssl_cipher_iv_length('aes-256-gcm');
            $iv = openssl_random_pseudo_bytes($ivLength);
            
            $ciphertext = openssl_encrypt(
                $value,
                'aes-256-gcm',
                $keyRaw,
                OPENSSL_RAW_DATA,
                $iv,
                $tag
            );

            $payload = [
                'ciphertext' => base64_encode($ciphertext),
                'iv' => base64_encode($iv),
                'tag' => base64_encode($tag)
            ];

            return base64_encode(json_encode($payload));
        } catch (\Exception $e) {
            return $value;
        }
    }

    /**
     * Retrieve the raw encryption key from config.
     */
    protected function getEncryptionKey(): string
    {
        $appKey = config('app.key');
        if (str_starts_with($appKey, 'base64:')) {
            return base64_decode(substr($appKey, 7));
        }
        return $appKey;
    }
}
