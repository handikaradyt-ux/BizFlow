<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaction extends Model
{
    use HasFactory;

    // Valid status transitions map: current status => allowed next statuses
    public const STATUS_TRANSITIONS = [
        'pending'   => ['completed', 'cancelled'],
        'completed' => ['refunded'],
        'cancelled' => [],
        'refunded'  => [],
    ];

    public const ALL_STATUSES = ['pending', 'completed', 'cancelled', 'refunded'];

    protected $fillable = [
        'customer_id',
        'user_id',
        'subtotal',
        'tax',
        'grand_total',
        'status',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax' => 'decimal:2',
        'grand_total' => 'decimal:2',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function details(): HasMany
    {
        return $this->hasMany(TransactionDetail::class);
    }

    public function transactionDetails(): HasMany
    {
        return $this->details();
    }

    /**
     * Check whether transitioning to a new status is valid.
     */
    public function canTransitionTo(string $newStatus): bool
    {
        $allowed = self::STATUS_TRANSITIONS[$this->status] ?? [];

        return in_array($newStatus, $allowed);
    }
}