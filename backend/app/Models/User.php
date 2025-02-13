<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Support\Facades\Crypt;

class User extends Authenticatable
{
    use Notifiable, HasApiTokens;

    // Define fillable fields
    protected $fillable = [
        'name', 'email', 'password', 'phone', 'address', 'google2fa_secret'
    ];

    // Ensure password is hidden when serializing user data
    protected $hidden = [
        'password', 'remember_token',
    ];

    // Accessor for decrypting phone
    public function getPhoneAttribute($value)
    {
        return $value ? Crypt::decryptString($value) : null;
    }

    // Accessor for decrypting address
    public function getAddressAttribute($value)
    {
        return $value ? Crypt::decryptString($value) : null;
    }

   public function customizations()
   {
       return $this->hasMany(Customization::class);
   }

   public function wishlist()
  {
       return $this->hasMany(Wishlist::class);
  }

  public function gamifications()
 {
      return $this->hasMany(Gamification::class);
 }

}
