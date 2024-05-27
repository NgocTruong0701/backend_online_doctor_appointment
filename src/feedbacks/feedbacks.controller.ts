import { Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { FeedbacksService } from './feedbacks.service';
import { Public } from 'src/common/decorator/public.decorator';
import { ResponseData } from 'src/common/global/responde.data';
import { HttpMessage } from 'src/common/enum/httpstatus.enum';

@Controller('feedbacks')
@ApiTags('feedbacks')
export class FeedbacksController {
    constructor(
        private readonly feedbackService: FeedbacksService
    ) { }

    @Get(':doctorId')
    @Public()
    async getAvFeedbackByDoctorId(
        @Param('doctorId', new ParseIntPipe()) doctorId: number
    ) {
        try {
            const averageRating = await this.feedbackService.getAverageRatingByDoctorId(doctorId);
            return new ResponseData(averageRating, HttpStatus.OK, HttpMessage.OK);
        } catch (err) {
            throw new HttpException(err.message, err.status);
        }
    }

    @Get('appointment/:id')
    @Public()
    async getFeedBackOfAppointment(@Param('id', new ParseIntPipe()) id: number) {
        try {
            const result = await this.feedbackService.getFeedBackOfAppointment(id);
            return new ResponseData(result, HttpStatus.OK, HttpMessage.OK);
        } catch (err) {
            throw new HttpException(err.message, err.status);
        }
    }

    @Get('get-review-doctor/:id')
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Page number for pagination',
    })
    @Public()
    async getReviewDoctorById(
        @Param('id', new ParseIntPipe()) id: number,
        @Query('limit') limit?: number,
    ) {
        try {
            const result = await this.feedbackService.getReviewDoctorById(id, limit);
            return new ResponseData(result, HttpStatus.OK, HttpMessage.OK);
        } catch (err) {
            throw new HttpException(err.message, err.status);
        }
    }
}
