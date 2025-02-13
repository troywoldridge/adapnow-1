<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Filter extends Model
{
    use HasFactory;

    protected $table = 'filters';

    // Define fillable fields if needed
    protected $fillable = ['name', 'type', 'value'];
}

